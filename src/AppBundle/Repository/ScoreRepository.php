<?php

namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * ScoreRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ScoreRepository extends EntityRepository
{
    public function findByIdChallenge($idChallenge)
    {
    	$score = $this ->createQueryBuilder('score');

    	$score
    		->where('score.idChallenge = :idChallenge')
    		->setParameter('idChallenge', $idChallenge);

        return $score->getQuery()->getResult();
    }
}